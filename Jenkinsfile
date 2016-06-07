node('docker') {

  checkout scm

  stage 'container'
  def container = docker.build('willhughes_name')

  container.inside {
    stage 'npm'
    sh('npm install .')

    stage 'build'
    sh('node ./node_modules/.bin/gulp release')

    stage 'check-links'
    sh('''#!/bin/bash
    trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT
    cd public
    python -m SimpleHTTPServer > /dev/null 2>&1 &
    cd ..
    linkchecker http://localhost:8000/ --check-extern || true
    ''')

  }

  stage 'upload'
  sshagent(['6ba10844-b480-4dbe-be8f-c692dbfcdfe7']) {
    sh('''cd public
    rsync -avz . www-static@zaphod.hhome.me:/srv/http/willhughes.name/
    ''')
  }

}
