node('docker') {

  checkout scm

  stage 'container'
  def container = docker.build('willhughes_name')

  container.inside {
    stage 'npm'
    sh('npm install .')

    stage 'build'
    sh('node ./node_modules/.bin/gulp release')
  }
}