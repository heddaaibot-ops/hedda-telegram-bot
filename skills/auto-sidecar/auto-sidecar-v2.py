#!/usr/bin/env python3
"""
Auto Sidecar for iPad mini (v2)
使用更簡單的方法連接 Sidecar

Created for Hedda 姐姐 by Piggyx 🩵
"""

import subprocess
import sys

def run_applescript(script):
    """執行 AppleScript"""
    process = subprocess.Popen(
        ['osascript', '-'],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    stdout, stderr = process.communicate(script.encode('utf-8'))
    return stdout.decode('utf-8'), stderr.decode('utf-8'), process.returncode

def connect_sidecar():
    """連接 Sidecar - 使用控制中心"""
    print("🔍 正在連接 iPad mini via Sidecar...")

    script = '''
    tell application "System Events"
        -- 點擊選單列的控制中心
        tell process "ControlCenter"
            -- 嘗試點擊螢幕鏡像/Sidecar 按鈕
            set frontmost to true
            delay 0.5

            -- 使用快捷鍵開啟螢幕鏡像選單
            -- Fn + F1 (在某些 Mac 上) 或使用選單列
        end tell
    end tell

    -- 使用選單列的顯示器選項
    tell application "System Events"
        tell process "SystemUIServer"
            try
                -- 點擊選單列的顯示器圖示
                click (first menu bar item whose description contains "display" or description contains "Displays") of menu bar 1
                delay 1
            end try
        end tell
    end tell
    '''

    stdout, stderr, returncode = run_applescript(script)

    if returncode != 0:
        print(f"⚠️  AppleScript 執行遇到問題")
        print(f"錯誤訊息: {stderr}")
        print("\n🔧 建議使用手動方式：")
        print("   1. 點擊選單列右上角的「控制中心」")
        print("   2. 點擊「螢幕鏡像」")
        print("   3. 選擇你的 iPad mini")
        return False

    print("✅ 已嘗試開啟 Sidecar 選單，請手動選擇 iPad mini")
    return True

def open_display_preferences():
    """開啟顯示器偏好設定"""
    print("📺 正在開啟顯示器設定...")

    script = '''
    tell application "System Settings"
        activate
        delay 1
    end tell

    tell application "System Events"
        tell process "System Settings"
            click button "Displays" of scroll area 1 of window 1
        end tell
    end tell
    '''

    stdout, stderr, returncode = run_applescript(script)

    if returncode == 0:
        print("✅ 已開啟顯示器設定")
        print("💡 請在視窗中尋找 'Add Display' 或連接到 iPad 的選項")
    else:
        # 備用方案：使用 URL scheme
        subprocess.run(['open', 'x-apple.systempreferences:com.apple.Displays-Settings.extension'])
        print("✅ 已開啟顯示器設定（備用方式）")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "connect":
            connect_sidecar()
        elif command == "settings":
            open_display_preferences()
        else:
            print("用法: auto-sidecar-v2.py [connect|settings]")
    else:
        # 預設：開啟設定
        open_display_preferences()
