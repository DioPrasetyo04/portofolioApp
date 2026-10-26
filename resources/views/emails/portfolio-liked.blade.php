<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Portfolio Like</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #0b0f19;
            color: #f1f5f9;
        }
        .container {
            max-width: 580px;
            margin: 30px auto;
            background: #111827;
            border-radius: 20px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        }
        .header {
            background: linear-gradient(135deg, #e11d48 0%, #9333ea 50%, #2563eb 100%);
            padding: 40px 30px;
            text-align: center;
        }
        .header-icon {
            font-size: 52px;
            line-height: 1;
            margin-bottom: 12px;
            display: inline-block;
            filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }
        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 8px 0 0;
            color: rgba(255, 255, 255, 0.9);
            font-size: 14px;
        }
        .content {
            padding: 35px 30px;
        }
        .counter-badge {
            background: rgba(225, 29, 72, 0.15);
            border: 1px solid rgba(225, 29, 72, 0.4);
            border-radius: 14px;
            padding: 16px 20px;
            text-align: center;
            margin-bottom: 26px;
        }
        .counter-badge .number {
            font-size: 38px;
            font-weight: 900;
            color: #fb7185;
            line-height: 1;
        }
        .counter-badge .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: #cbd5e1;
            margin-top: 6px;
        }
        .info-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 28px;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.06);
        }
        .info-table td {
            padding: 12px 16px;
            font-size: 13px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }
        .info-table tr:last-child td {
            border-bottom: none;
        }
        .info-table td.key {
            color: #94a3b8;
            font-weight: 600;
            width: 32%;
        }
        .info-table td.val {
            color: #f8fafc;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            word-break: break-all;
        }
        .btn-wrapper {
            text-align: center;
            margin: 30px 0 10px;
        }
        .btn {
            display: inline-block;
            background: linear-gradient(135deg, #e11d48, #9333ea);
            color: #ffffff;
            text-decoration: none;
            padding: 13px 32px;
            border-radius: 9999px;
            font-weight: 700;
            font-size: 14px;
            letter-spacing: 0.5px;
            box-shadow: 0 4px 15px rgba(225, 29, 72, 0.4);
        }
        .footer {
            padding: 20px 30px;
            text-align: center;
            font-size: 11px;
            color: #64748b;
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(0, 0, 0, 0.2);
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="header-icon">❤️</div>
            <h1>New Portfolio Like!</h1>
            <p>Someone just clicked the Like button on your portfolio website</p>
        </div>

        <!-- Body Content -->
        <div class="content">
            <!-- Counter Badge -->
            <div class="counter-badge">
                <div class="number">{{ number_format($totalLikes) }}</div>
                <div class="label">Total Portfolio Likes</div>
            </div>

            <!-- Metadata Table -->
            <table class="info-table">
                <tr>
                    <td class="key">📅 Liked Time</td>
                    <td class="val">{{ $likedAt }}</td>
                </tr>
                <tr>
                    <td class="key">🌐 IP Address</td>
                    <td class="val">{{ $ipAddress }}</td>
                </tr>
                <tr>
                    <td class="key">💻 User Agent</td>
                    <td class="val">{{ $userAgent ?? 'Unknown Browser' }}</td>
                </tr>
                <tr>
                    <td class="key">🛡️ Anti-Spam</td>
                    <td class="val" style="color: #34d399;">Passed (Unique IP & Rate-Limited)</td>
                </tr>
            </table>

            <!-- Action Button -->
            <div class="btn-wrapper">
                <a href="{{ config('app.url') }}/admin" class="btn" target="_blank">
                    Open Admin Dashboard &rarr;
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            Automated notification sent from your <strong>Portfolio Interactive System</strong>.<br>
            Anti-spam dual protection is active.
        </div>
    </div>
</body>
</html>
