@echo off
cd /d R:\work\apexgard-site
git add -A
git commit -m "Remove temp commit script"
del /q R:\work\apexgard-site\cleanup-tmp.cmd
git status --short
git log --oneline
