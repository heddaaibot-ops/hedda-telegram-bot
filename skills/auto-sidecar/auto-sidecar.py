#!/usr/bin/env python3
"""
Auto Sidecar for iPad mini
自動連接 iPad mini 作為 Sidecar 顯示器

Created for Hedda 姐姐 by Piggyx 🩵
"""

import subprocess
import sys
import time

def run_applescript(script):
    """執行 AppleScript"""
    process = subprocess.Popen(
        ['osascript', '-e', script],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    stdout, stderr = process.communicate()
    return stdout.decode('utf-8'), stderr.decode('utf-8'), process.returncode

def connect_sidecar():
    """連接 Sidecar"""
    print("🔍 正在連接 iPad mini via Sidecar...")

    # 方法 1: 使用 System Preferences
    script = '''
    tell application "System Preferences"
        reveal pane id "com.apple.preference.displays"
        activate
        delay 1
    end tell

    tell application "System Events"
        tell process "System Preferences"
            try
                click button "Connect to:" of window 1
                delay 0.5
                -- 選擇第一個可用的 iPad
                click menu item 1 of menu 1 of button "Connect to:" of window 1
                delay 2
            on error errMsg
                return "Error: " & errMsg
            end try
        end tell
    end tell

    tell application "System Preferences"
        quit
    end tell

    return "Connected"
    '''

    stdout, stderr, returncode = run_applescript(script)

    if returncode == 0 and "Connected" in stdout:
        print("✅ Sidecar 已連接！")
        return True
    else:
        print(f"❌ 連接失敗: {stderr}")
        return False

def disconnect_sidecar():
    """斷開 Sidecar"""
    print("🔌 正在斷開 Sidecar...")

    script = '''
    tell application "System Preferences"
        reveal pane id "com.apple.preference.displays"
        activate
        delay 1
    end tell

    tell application "System Events"
        tell process "System Preferences"
            try
                click button "Disconnect" of window 1
                delay 1
            on error
                -- 已經斷開了
            end try
        end tell
    end tell

    tell application "System Preferences"
        quit
    end tell
    '''

    run_applescript(script)
    print("✅ Sidecar 已斷開")

def check_sidecar_status():
    """檢查 Sidecar 狀態"""
    script = '''
    tell application "System Events"
        tell process "ControlCenter"
            return exists (menu bar item "Display" of menu bar 1)
        end tell
    end tell
    '''

    stdout, stderr, returncode = run_applescript(script)
    return "true" in stdout.lower()

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()

        if command == "connect":
            connect_sidecar()
        elif command == "disconnect":
            disconnect_sidecar()
        elif command == "status":
            if check_sidecar_status():
                print("✅ Sidecar 可用")
            else:
                print("❌ Sidecar 不可用")
        else:
            print("用法: auto-sidecar.py [connect|disconnect|status]")
    else:
        # 預設行為：連接
        connect_sidecar()
