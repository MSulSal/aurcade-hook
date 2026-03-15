Add-Type -AssemblyName System.Drawing

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$outputDir = Join-Path $root "assets/fighters/aurcade-sprites"
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

function New-Color {
  param(
    [Parameter(Mandatory = $true)][string]$Hex,
    [int]$Alpha = 255
  )
  $clean = $Hex.TrimStart("#")
  $r = [Convert]::ToInt32($clean.Substring(0, 2), 16)
  $g = [Convert]::ToInt32($clean.Substring(2, 2), 16)
  $b = [Convert]::ToInt32($clean.Substring(4, 2), 16)
  return [System.Drawing.Color]::FromArgb($Alpha, $r, $g, $b)
}

function Draw-GlowEllipse {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [string]$ColorHex
  )
  for ($i = 8; $i -ge 1; $i--) {
    $alpha = [Math]::Max(8, 14 * $i)
    $inflate = 14 * $i
    $brush = New-Object System.Drawing.SolidBrush (New-Color $ColorHex $alpha)
    $Graphics.FillEllipse($brush, $X - $inflate, $Y - $inflate, $Width + ($inflate * 2), $Height + ($inflate * 2))
    $brush.Dispose()
  }
}

function Draw-Cabinet {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Scale,
    [string]$PrimaryHex,
    [string]$SecondaryHex
  )

  $w = 220 * $Scale
  $h = 520 * $Scale

  $bodyPoints = [System.Drawing.PointF[]]@(
    [System.Drawing.PointF]::new($X + (32 * $Scale), $Y),
    [System.Drawing.PointF]::new($X + $w, $Y),
    [System.Drawing.PointF]::new($X + ($w - (22 * $Scale)), $Y + $h),
    [System.Drawing.PointF]::new($X, $Y + $h)
  )

  $bodyBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.PointF]::new($X, $Y),
    [System.Drawing.PointF]::new($X + $w, $Y + $h),
    (New-Color $PrimaryHex 240),
    (New-Color $SecondaryHex 235)
  )
  $Graphics.FillPolygon($bodyBrush, $bodyPoints)
  $bodyBrush.Dispose()

  $edgePen = New-Object System.Drawing.Pen((New-Color $SecondaryHex 255), (4 * $Scale))
  $Graphics.DrawPolygon($edgePen, $bodyPoints)
  $edgePen.Dispose()

  $screenX = $X + (40 * $Scale)
  $screenY = $Y + (95 * $Scale)
  $screenW = 130 * $Scale
  $screenH = 165 * $Scale
  $screenBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.PointF]::new($screenX, $screenY),
    [System.Drawing.PointF]::new($screenX + $screenW, $screenY + $screenH),
    (New-Color "#2d83ff" 248),
    (New-Color "#4cffea" 242)
  )
  $Graphics.FillRectangle($screenBrush, $screenX, $screenY, $screenW, $screenH)
  $screenBrush.Dispose()

  $screenPen = New-Object System.Drawing.Pen((New-Color "#dcf7ff" 220), (3 * $Scale))
  $Graphics.DrawRectangle($screenPen, $screenX, $screenY, $screenW, $screenH)
  $screenPen.Dispose()

  $panelBrush = New-Object System.Drawing.SolidBrush (New-Color "#081127" 220)
  $Graphics.FillRectangle($panelBrush, $X + (28 * $Scale), $Y + (300 * $Scale), 165 * $Scale, 72 * $Scale)
  $panelBrush.Dispose()

  $btnBrush = New-Object System.Drawing.SolidBrush (New-Color "#67fff1" 238)
  $Graphics.FillEllipse($btnBrush, $X + (53 * $Scale), $Y + (325 * $Scale), 18 * $Scale, 18 * $Scale)
  $Graphics.FillEllipse($btnBrush, $X + (84 * $Scale), $Y + (325 * $Scale), 18 * $Scale, 18 * $Scale)
  $Graphics.FillEllipse($btnBrush, $X + (115 * $Scale), $Y + (325 * $Scale), 18 * $Scale, 18 * $Scale)
  $btnBrush.Dispose()
}

function Draw-BracketTree {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height,
    [string]$ColorHex
  )

  $pen = New-Object System.Drawing.Pen((New-Color $ColorHex 200), 4)
  for ($i = 0; $i -lt 4; $i++) {
    $offset = $i * ($Height / 4)
    $Graphics.DrawLine($pen, $X, $Y + $offset + 30, $X + 80, $Y + $offset + 30)
    $Graphics.DrawLine($pen, $X + 80, $Y + $offset + 30, $X + 80, $Y + $offset + 80)
    $Graphics.DrawLine($pen, $X + 80, $Y + $offset + 80, $X + 160, $Y + $offset + 80)
  }
  $Graphics.DrawLine($pen, $X + 160, $Y + 95, $X + 240, $Y + 95)
  $Graphics.DrawLine($pen, $X + 160, $Y + 255, $X + 240, $Y + 255)
  $Graphics.DrawLine($pen, $X + 240, $Y + 95, $X + 240, $Y + 255)
  $pen.Dispose()
}

function Draw-Track {
  param(
    [System.Drawing.Graphics]$Graphics,
    [float]$X,
    [float]$Y,
    [float]$Width,
    [float]$Height
  )
  $trackPen = New-Object System.Drawing.Pen((New-Color "#6de8ff" 190), 8)
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddBezier($X + 30, $Y + $Height - 20, $X + 180, $Y + $Height - 160, $X + 290, $Y + 60, $X + $Width - 40, $Y + 20)
  $Graphics.DrawPath($trackPen, $path)
  $path.Dispose()
  $trackPen.Dispose()
}

function Draw-TokenTrail {
  param([System.Drawing.Graphics]$Graphics, [float]$X, [float]$Y)
  for ($i = 0; $i -lt 7; $i++) {
    $cx = $X + ($i * 56)
    $cy = $Y + ([Math]::Sin($i * 0.75) * 24)
    $coinBrush = New-Object System.Drawing.SolidBrush (New-Color "#ffd84d" 234)
    $Graphics.FillEllipse($coinBrush, $cx, $cy, 34, 34)
    $coinBrush.Dispose()
  }
}

function Draw-Scanlines {
  param([System.Drawing.Graphics]$Graphics, [int]$Width, [int]$Height)
  $scanPen = New-Object System.Drawing.Pen((New-Color "#9fd8ff" 18), 2)
  for ($y = 210; $y -lt ($Height - 110); $y += 8) {
    $Graphics.DrawLine($scanPen, 150, $y, $Width - 150, $y)
  }
  $scanPen.Dispose()
}

function Save-Sprite {
  param(
    [string]$Name,
    [string]$Label,
    [string]$PrimaryHex,
    [string]$SecondaryHex,
    [ValidateSet("duel", "bracket", "speed", "pinball", "venue", "tokens", "record", "map", "crowd", "score", "dojo", "arena")][string]$Motif
  )

  $width = 1024
  $height = 1400
  $bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))

  Draw-GlowEllipse -Graphics $graphics -X 160 -Y 140 -Width 700 -Height 980 -ColorHex $PrimaryHex
  Draw-GlowEllipse -Graphics $graphics -X 220 -Y 780 -Width 580 -Height 200 -ColorHex $SecondaryHex

  switch ($Motif) {
    "duel" {
      Draw-Cabinet -Graphics $graphics -X 160 -Y 260 -Scale 1.05 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      Draw-Cabinet -Graphics $graphics -X 620 -Y 290 -Scale 0.96 -PrimaryHex $SecondaryHex -SecondaryHex $PrimaryHex
    }
    "bracket" {
      Draw-Cabinet -Graphics $graphics -X 430 -Y 300 -Scale 0.86 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      Draw-BracketTree -Graphics $graphics -X 200 -Y 340 -Width 330 -Height 350 -ColorHex $SecondaryHex
      Draw-BracketTree -Graphics $graphics -X 530 -Y 340 -Width 330 -Height 350 -ColorHex $PrimaryHex
    }
    "speed" {
      Draw-Track -Graphics $graphics -X 180 -Y 400 -Width 660 -Height 460
      Draw-Cabinet -Graphics $graphics -X 350 -Y 260 -Scale 0.86 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
    }
    "pinball" {
      $tableBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.PointF]::new(230, 320),
        [System.Drawing.PointF]::new(780, 980),
        (New-Color $PrimaryHex 230),
        (New-Color $SecondaryHex 220)
      )
      $tablePath = New-Object System.Drawing.Drawing2D.GraphicsPath
      $tablePath.AddPolygon([System.Drawing.PointF[]]@(
          [System.Drawing.PointF]::new(280, 320),
          [System.Drawing.PointF]::new(760, 360),
          [System.Drawing.PointF]::new(700, 980),
          [System.Drawing.PointF]::new(230, 940)
        ))
      $graphics.FillPath($tableBrush, $tablePath)
      $tableBrush.Dispose()
      $tablePath.Dispose()
      $ball = New-Object System.Drawing.SolidBrush (New-Color "#e8fbff" 236)
      $graphics.FillEllipse($ball, 560, 560, 58, 58)
      $ball.Dispose()
    }
    "venue" {
      Draw-Cabinet -Graphics $graphics -X 180 -Y 360 -Scale 0.86 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      Draw-Cabinet -Graphics $graphics -X 430 -Y 320 -Scale 0.92 -PrimaryHex $SecondaryHex -SecondaryHex $PrimaryHex
      Draw-Cabinet -Graphics $graphics -X 680 -Y 370 -Scale 0.84 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
    }
    "tokens" {
      Draw-TokenTrail -Graphics $graphics -X 300 -Y 430
      Draw-Cabinet -Graphics $graphics -X 390 -Y 310 -Scale 0.9 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
    }
    "record" {
      Draw-Cabinet -Graphics $graphics -X 390 -Y 300 -Scale 0.88 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      $cupBrush = New-Object System.Drawing.SolidBrush (New-Color "#ffe071" 240)
      $graphics.FillRectangle($cupBrush, 450, 700, 120, 45)
      $graphics.FillEllipse($cupBrush, 430, 640, 160, 90)
      $graphics.FillEllipse($cupBrush, 430, 725, 40, 50)
      $graphics.FillEllipse($cupBrush, 550, 725, 40, 50)
      $cupBrush.Dispose()
    }
    "map" {
      Draw-Cabinet -Graphics $graphics -X 380 -Y 320 -Scale 0.92 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      $mapPen = New-Object System.Drawing.Pen((New-Color "#86ffe1" 210), 4)
      $path = New-Object System.Drawing.Drawing2D.GraphicsPath
      $path.AddBezier(250, 720, 340, 610, 490, 810, 650, 660)
      $graphics.DrawPath($mapPen, $path)
      $path.Dispose()
      $mapPen.Dispose()
    }
    "crowd" {
      Draw-Cabinet -Graphics $graphics -X 270 -Y 290 -Scale 0.88 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      Draw-Cabinet -Graphics $graphics -X 520 -Y 290 -Scale 0.88 -PrimaryHex $SecondaryHex -SecondaryHex $PrimaryHex
      for ($i = 0; $i -lt 20; $i++) {
        $cx = 220 + ($i * 30)
        $cy = 910 + ([Math]::Sin($i * 0.65) * 22)
        $crowdBrush = New-Object System.Drawing.SolidBrush (New-Color "#b5f6ff" 170)
        $graphics.FillEllipse($crowdBrush, $cx, $cy, 20, 20)
        $crowdBrush.Dispose()
      }
    }
    "score" {
      Draw-Cabinet -Graphics $graphics -X 390 -Y 320 -Scale 0.92 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      $scoreFont = New-Object System.Drawing.Font("Consolas", 72, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
      $scoreBrush = New-Object System.Drawing.SolidBrush (New-Color "#b6fff1" 215)
      $graphics.DrawString("999,999", $scoreFont, $scoreBrush, 280, 780)
      $scoreBrush.Dispose()
      $scoreFont.Dispose()
    }
    "dojo" {
      Draw-Cabinet -Graphics $graphics -X 420 -Y 320 -Scale 0.86 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      $ringPen = New-Object System.Drawing.Pen((New-Color "#85ffe6" 215), 6)
      $graphics.DrawEllipse($ringPen, 260, 530, 500, 250)
      $ringPen.Dispose()
    }
    "arena" {
      Draw-Cabinet -Graphics $graphics -X 250 -Y 340 -Scale 0.82 -PrimaryHex $PrimaryHex -SecondaryHex $SecondaryHex
      Draw-Cabinet -Graphics $graphics -X 560 -Y 340 -Scale 0.82 -PrimaryHex $SecondaryHex -SecondaryHex $PrimaryHex
      $beamPen = New-Object System.Drawing.Pen((New-Color "#92e9ff" 220), 5)
      $graphics.DrawLine($beamPen, 260, 250, 760, 250)
      $graphics.DrawLine($beamPen, 240, 280, 780, 280)
      $beamPen.Dispose()
    }
  }

  Draw-Scanlines -Graphics $graphics -Width $width -Height $height

  $plateBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
    [System.Drawing.PointF]::new(170, 1060),
    [System.Drawing.PointF]::new(860, 1180),
    (New-Color $PrimaryHex 180),
    (New-Color $SecondaryHex 165)
  )
  $graphics.FillRoundedRectangle($plateBrush, 180, 1060, 664, 150, 60)
  $plateBrush.Dispose()

  $labelFont = New-Object System.Drawing.Font("Impact", 68, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
  $labelBrush = New-Object System.Drawing.SolidBrush (New-Color "#d8fcff" 235)
  $stringFormat = New-Object System.Drawing.StringFormat
  $stringFormat.Alignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString($Label, $labelFont, $labelBrush, [System.Drawing.RectangleF]::new(180, 1082, 664, 120), $stringFormat)
  $stringFormat.Dispose()
  $labelBrush.Dispose()
  $labelFont.Dispose()

  $outputPath = Join-Path $outputDir "$Name.png"
  $bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

# Rounded rectangle extension for billboard plate.
Update-TypeData -TypeName System.Drawing.Graphics -MemberName FillRoundedRectangle -MemberType ScriptMethod -Value {
  param([System.Drawing.Brush]$Brush, [float]$X, [float]$Y, [float]$Width, [float]$Height, [float]$Radius)
  $diameter = $Radius * 2
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
  $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
  $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  $this.FillPath($Brush, $path)
  $path.Dispose()
} -Force

$sprites = @(
  @{ Name = "mazegrid"; Label = "MAZE GRID"; PrimaryHex = "#00b5ff"; SecondaryHex = "#48fff7"; Motif = "duel" },
  @{ Name = "comboburst"; Label = "COMBO BURST"; PrimaryHex = "#a15cff"; SecondaryHex = "#4ffff2"; Motif = "arena" },
  @{ Name = "speedlane"; Label = "SPEED LANE"; PrimaryHex = "#58b5ff"; SecondaryHex = "#8dffea"; Motif = "speed" },
  @{ Name = "pinballorbit"; Label = "PINBALL ORBIT"; PrimaryHex = "#32d6ff"; SecondaryHex = "#8a8dff"; Motif = "pinball" },
  @{ Name = "cabinetcore"; Label = "CABINET CORE"; PrimaryHex = "#36b8ff"; SecondaryHex = "#5dffb2"; Motif = "venue" },
  @{ Name = "mapradar"; Label = "MAP RADAR"; PrimaryHex = "#37d4ff"; SecondaryHex = "#73ffa1"; Motif = "map" },
  @{ Name = "wrcrown"; Label = "WR CROWN"; PrimaryHex = "#38c8ff"; SecondaryHex = "#ffe071"; Motif = "record" },
  @{ Name = "bracketgrid"; Label = "BRACKET GRID"; PrimaryHex = "#55aaff"; SecondaryHex = "#62ffef"; Motif = "bracket" },
  @{ Name = "tokenspark"; Label = "TOKEN SPARK"; PrimaryHex = "#5fb8ff"; SecondaryHex = "#ffd95d"; Motif = "tokens" },
  @{ Name = "leaderpulse"; Label = "LEADER PULSE"; PrimaryHex = "#4dbfff"; SecondaryHex = "#9affea"; Motif = "score" },
  @{ Name = "eventbeacon"; Label = "EVENT BEACON"; PrimaryHex = "#4dc3ff"; SecondaryHex = "#ff7ed7"; Motif = "crowd" },
  @{ Name = "neondojo"; Label = "NEON DOJO"; PrimaryHex = "#37c2ff"; SecondaryHex = "#71ffe8"; Motif = "dojo" }
)

foreach ($sprite in $sprites) {
  Save-Sprite @sprite
}

Write-Output "Generated $($sprites.Count) transparent PNG sprites in $outputDir"
