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

  stage ('publish-preprod') {
    def image = image_cannonical_id('harbor.hhome.me/library/willhughes_name:static')
    helmDeploy {
      stack = 'whn-preprod'
      namespace = 'whn-preprod'
      chart = 'internal/staticsite'
      version = '0.1.2'
      args = [
      'image.image': image
      ]
    }
  }

  stage ('check-links') {
    sh('docker run --rm willhughes_name linkchecker https://whn-preprod.hhome.me/ --check-extern')
  }

}
