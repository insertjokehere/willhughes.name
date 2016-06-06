node('docker') {

  checkout poll: false, scm: [$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'SubmoduleOption', disableSubmodules: false, recursiveSubmodules: true, reference: '', trackingSubmodules: false]], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '4445dab5-5361-4e23-8229-5eaa1eb38687', url: 'git@git.hhome.me:blog-hugo']]]

  stage 'container'
  def container = docker.build('willhughes_name')

  container.inside {
    stage 'npm'
    sh('npm install .')

    stage 'build'
    sh('nodejs ./node_modules/.bin/gulp release')
  }
}