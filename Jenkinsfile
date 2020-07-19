node('docker') {

  checkout scm
  def container

  stage ('container') {
    container = docker.build('willhughes_name')
  }

  container.inside {

    stage ('build') {
      sh('''#!/bin/bash -e
    rm -rf public/ || true
    whn_install_deps.sh `pwd`
    NODE_ENV=production ./node_modules/.bin/gulp
    tar -cf site.tar public/*
    ''')
    }

    archiveArtifacts artifacts: 'site.tar'

  }

  stage ('build-static') {
    buildAndPush {
      image = 'library/willhughes_name'
      dockerfile = 'Dockerfile.static'
      tag = 'static'
    }
  }

  stage ('downstream') {
    result = sh (script: "git log -1 | grep '/publish'", returnStatus: true)
    if (result == 0) {
      build job: 'willhughes.name-publish', wait: false
    }
    build job: 'helm-configs', wait: false
  }

}
