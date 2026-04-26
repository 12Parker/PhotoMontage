#!/usr/bin/env python3
"""
Simple HTTP server to serve the timeline app locally.
This avoids CORS issues when loading images from the file system.
"""

import argparse
import errno
import http.server
import os
import socketserver
import sys
import webbrowser

DEFAULT_PORT = 8000
MAX_PORT_ATTEMPTS = 10


class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()


def parse_args():
    parser = argparse.ArgumentParser(description='Run local PhotoMontage server.')
    parser.add_argument('--port', type=int, default=DEFAULT_PORT, help='Port to bind (default: 8000).')
    parser.add_argument('--no-open', action='store_true', help='Do not auto-open a browser tab.')
    return parser.parse_args()


def run_server(start_port: int, open_browser: bool):
    for offset in range(MAX_PORT_ATTEMPTS):
        port = start_port + offset
        try:
            with socketserver.TCPServer(('', port), CustomHTTPRequestHandler) as httpd:
                print(f'🚀 Timeline server starting at http://localhost:{port}')
                print('📸 Your photo timeline is now available!')
                print('🔄 Press Ctrl+C to stop the server')
                print('-' * 50)

                if open_browser:
                    webbrowser.open(f'http://localhost:{port}')
                    print('🌐 Browser opened automatically')
                else:
                    print(f'🌐 Open http://localhost:{port} in your browser')

                httpd.serve_forever()
                return
        except OSError as error:
            if error.errno == errno.EADDRINUSE and offset < MAX_PORT_ATTEMPTS - 1:
                print(f'⚠️ Port {port} is already in use. Trying {port + 1}...')
                continue
            print(f'❌ Error starting server: {error}')
            sys.exit(1)


def main():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    args = parse_args()

    try:
        run_server(args.port, not args.no_open)
    except KeyboardInterrupt:
        print('\n👋 Server stopped. Thanks for using the Timeline app!')
        sys.exit(0)


if __name__ == '__main__':
    main()
