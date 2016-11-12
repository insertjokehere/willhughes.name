node('docker') {

  checkout scm

  stage 'container'
  def container = docker.build('willhughes_name')

  container.inside {

    stage 'build'
    sh('''#!/bin/bash
    whn_install_deps.sh `pwd`
    NODE_ENV=production ./node_modules/.bin/gulp
    if [[ -z `find public/css/ -type f -empty` ]]; then true; else false; fi
    if [[ -z `find public/js/ -type f -empty` ]]; then true; else false; fi
    ''')

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
  withCredentials([[$class: 'UsernamePasswordMultiBinding', credentialsId: 'b4d1ca70-47a0-48e7-9871-5757171c49b1', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID']]) {
    sh('''if [ ! -d venv ]; then
        python -m virtualenv venv
    fi
    . venv/bin/activate
    pip install awscli
    cd public
    aws s3 sync . s3://www.willhughes.name --exclude ".git/*" --exclude ".git*" --delete --cache-control max-age=43200
    ''')
  }

}
