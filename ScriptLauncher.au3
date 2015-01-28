;~ https://www.autoitscript.com/autoit3/docs/functions/AutoItSetOption.htm
Opt("SendKeyDelay", 0) ; send keys speed
Opt("SendKeyDownDelay", 0)
Opt("WinTitleMatchMode", 2)

If $CmdLine[0] = 0 Then ; $CmdLine[0] gets arguments count provided via command line
   ConsoleWrite("ERROR: Script argument is empty! Please add path to script, example: 'ScriptLauncher.exe c:\path\to\MyScript.js'" & @CRLF)
   Exit 0
EndIf

Local $targetScript = $CmdLine[1]
;~ Local $targetScript = "d:\exigen\src\LazyLinks\Scripts\EIS\Customer\FillIndividualGeneralPage.js"
$targetScript = "file:///" & StringReplace($targetScript, "\", "/")

Local $brokerScript = "javascript:" & " " & _
   "content.document.getElementById('paramsBroker').setAttribute('value', '" & $targetScript & "');" & " " & _
   "window.location = 'imacros://run/?m=Start.js';"
ConsoleWrite($brokerScript & @CRLF)

Local $winId = WinActivate("- Mozilla Firefox")
If $winId > 0 Then
   Send("^l") ; set focus to address field send keys: CTRL + L
   Send($brokerScript)
;~    ControlSend("- Mozilla Firefox", "", "", $brokerScript)
   Send("{ENTER}")
Else
   ConsoleWrite("ERROR: Firefox window not found!" & @CRLF)
EndIf
