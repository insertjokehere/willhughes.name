node('docker') {

  checkout scm

  stage 'container'
  def container = docker.build('willhughes_name')

  container.inside {
    stage 'npm'
    sh('npm install .')

    stage 'check-spelling'
    sh('''#!/bin/bash
    aspelllint content/ || true
    ''')

    stage 'build'
    sh('node ./node_modules/.bin/gulp release')

    stage 'check-links'
    sh('''#!/bin/bash
    trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
    cd public
    python -m SimpleHTTPServer > /dev/null 2>&1 &
    cd ..
    linkchecker http://localhost:8000/ --check-extern
    ''')
  }
}
