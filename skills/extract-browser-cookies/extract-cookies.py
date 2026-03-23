#!/usr/bin/env python3
"""
從瀏覽器 Cookies 數據庫提取特定網站的 cookies

支援：Chrome、Brave、Edge 等 Chromium 瀏覽器
輸出：Playwright 兼容的 JSON 格式
"""

import sqlite3
import json
import os
import shutil
import sys
from pathlib import Path

# 瀏覽器 Cookies 路徑配置
BROWSER_PATHS = {
    "brave": "Library/Application Support/BraveSoftware/Brave-Browser/Default/Cookies",
    "chrome": "Library/Application Support/Google/Chrome/Default/Cookies",
    "edge": "Library/Application Support/Microsoft Edge/Default/Cookies",
}

# 網站域名映射
SITE_DOMAINS = {
    "twitter": ["%twitter.com%", "%x.com%"],
    "github": ["%github.com%"],
    "reddit": ["%reddit.com%"],
    "facebook": ["%facebook.com%"],
    "instagram": ["%instagram.com%"],
    "linkedin": ["%linkedin.com%"],
}

# 關鍵 cookies（用於驗證登錄狀態）
KEY_COOKIES = {
    "twitter": ["auth_token", "ct0"],
    "github": ["user_session"],
    "reddit": ["reddit_session"],
}


def find_browser_cookies():
    """查找可用的瀏覽器 Cookies 文件"""
    home = Path.home()

    for browser, rel_path in BROWSER_PATHS.items():
        cookies_path = home / rel_path
        if cookies_path.exists():
            return browser, cookies_path

    return None, None


def extract_cookies(site_name, browser_name=None):
    """
    從瀏覽器提取指定網站的 cookies

    Args:
        site_name: 網站名稱（如 'twitter', 'github'）
        browser_name: 指定瀏覽器，None 則自動檢測

    Returns:
        提取的 cookies 列表
    """
    print(f"🔍 提取 {site_name.upper()} cookies\n")

    # 查找瀏覽器
    if browser_name:
        cookies_path = Path.home() / BROWSER_PATHS.get(browser_name)
        if not cookies_path.exists():
            print(f"❌ 找不到 {browser_name} 的 Cookies 文件")
            return None
    else:
        browser_name, cookies_path = find_browser_cookies()
        if not cookies_path:
            print("❌ 找不到任何支援的瀏覽器")
            print("支援的瀏覽器: Brave, Chrome, Edge")
            return None

    print(f"✓ 使用瀏覽器: {browser_name.title()}")
    print(f"✓ Cookies 路徑: {cookies_path}\n")

    # 檢查網站域名配置
    domains = SITE_DOMAINS.get(site_name.lower())
    if not domains:
        print(f"⚠️  不認識的網站: {site_name}")
        print(f"支援的網站: {', '.join(SITE_DOMAINS.keys())}")
        # 使用自定義域名
        domains = [f"%{site_name}%"]

    # 複製數據庫（避免鎖定）
    temp_db = "/tmp/cookies-temp.db"
    try:
        shutil.copy2(cookies_path, temp_db)
    except Exception as e:
        print(f"❌ 複製數據庫失敗: {e}")
        return None

    try:
        # 連接數據庫
        conn = sqlite3.connect(temp_db)
        cursor = conn.cursor()

        # 構建查詢條件
        domain_conditions = " OR ".join([f"host_key LIKE ?" for _ in domains])
        query = f"""
        SELECT name, value, host_key, path, expires_utc, is_secure, is_httponly, samesite
        FROM cookies
        WHERE {domain_conditions}
        """

        cursor.execute(query, domains)
        rows = cursor.fetchall()

        if not rows:
            print(f"⚠️  沒有找到 {site_name} 的 cookies")
            print("💡 請確認已在瀏覽器中登錄該網站\n")
            conn.close()
            return None

        # 轉換為 Playwright 格式
        cookies = []
        for row in rows:
            name, value, domain, path, expires_utc, is_secure, is_httponly, samesite = row

            # Chrome cookies expires_utc 是微秒，需要轉換
            # Unix epoch: 1970-01-01, Chrome epoch: 1601-01-01
            # 差距: 11644473600 秒
            expires = -1
            if expires_utc:
                expires = expires_utc / 1000000 - 11644473600

            cookie = {
                "name": name,
                "value": value,
                "domain": domain,
                "path": path,
                "expires": expires,
                "httpOnly": bool(is_httponly),
                "secure": bool(is_secure),
                "sameSite": ["None", "Lax", "Strict"][samesite] if samesite in [0, 1, 2] else "None"
            }
            cookies.append(cookie)

        conn.close()

        print(f"✅ 提取了 {len(cookies)} 個 cookies")

        # 檢查關鍵 cookies
        key_cookie_names = KEY_COOKIES.get(site_name.lower(), [])
        found_keys = []
        for key_name in key_cookie_names:
            cookie = next((c for c in cookies if c['name'] == key_name), None)
            if cookie:
                found_keys.append(key_name)
                print(f"🔑 {key_name}: {cookie['value'][:30]}...")

        if key_cookie_names and found_keys:
            print(f"\n🎉 找到登錄狀態！({len(found_keys)}/{len(key_cookie_names)} 關鍵 cookies)")
        elif key_cookie_names:
            print(f"\n⚠️  未找到關鍵 cookies，可能未登錄")

        return cookies

    except Exception as e:
        print(f"❌ 錯誤: {e}")
        return None
    finally:
        # 清理臨時文件
        if os.path.exists(temp_db):
            os.remove(temp_db)


def save_cookies(cookies, site_name):
    """保存 cookies 到文件"""
    output_dir = Path.home() / ".config"
    output_dir.mkdir(parents=True, exist_ok=True)

    output_path = output_dir / f"{site_name}-cookies.json"

    with open(output_path, 'w') as f:
        json.dump(cookies, f, indent=2)

    print(f"\n💾 已保存到: {output_path}")

    print("\n📋 所有 cookies:")
    for c in cookies:
        print(f"   - {c['name']} ({c['domain']})")

    return output_path


def main():
    if len(sys.argv) < 2:
        print("用法: python3 extract-cookies.py [網站名稱] [瀏覽器]")
        print("\n範例:")
        print("  python3 extract-cookies.py twitter")
        print("  python3 extract-cookies.py github brave")
        print("\n支援的網站:", ", ".join(SITE_DOMAINS.keys()))
        print("支援的瀏覽器:", ", ".join(BROWSER_PATHS.keys()))
        sys.exit(1)

    site_name = sys.argv[1]
    browser_name = sys.argv[2] if len(sys.argv) > 2 else None

    cookies = extract_cookies(site_name, browser_name)

    if cookies:
        save_cookies(cookies, site_name)
        print("\n✅ 完成！")
    else:
        print("\n❌ 提取失敗")
        sys.exit(1)


if __name__ == "__main__":
    main()
