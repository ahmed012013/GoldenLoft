$path = "d:\proApp\GoldenLoft\frontend\components\creative.tsx"
$lines = Get-Content $path
# Lines to keep: 1 to 1250 (indices 0 to 1249)
# Lines to delete: 1251 to 2325 (indices 1250 to 2324)
# Lines to keep: 2326 to end (indices 2325 to end)

$part1 = $lines[0..1249]
$part2 = $lines[2325..($lines.Count-1)]
$newContent = $part1 + $part2
$newContent | Set-Content $path -Encoding UTF8
Write-Host "Removed lines 1251-2325. New line count: $($newContent.Count)"
