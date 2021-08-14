def digest
def build_tag = uniqueTag()

kanikoPod() {
    checkout scm
    stage('container') {
        container('kaniko') {
            digest = kanikoBuild {
                repo = 'library/willhughes_name'
                tag = build_tag
            }
        }
    }
}

withPod(digest) {
    checkout scm
    stage ('build') {
        container('main') {
            sh('''#!/bin/bash -e
rm -rf public/ || true
/usr/local/bin/whn_install_deps.sh `pwd`
NODE_ENV=production ./node_modules/.bin/gulp''')
        }
        zip archive: false, dir: 'public/', glob: '', zipFile: 'site.zip'
        archiveArtifacts artifacts: 'site.zip', fingerprint: true
    }
}

podTemplate(showRawYaml: false, yaml: """
kind: Pod
spec:
  containers:
  - name: main
    image: minio/mc:latest
    command:
    - /bin/cat
    tty: true
"""
    ) {
        node(POD_LABEL) {
            withCredentials([
                aws(
                    credentialsId: 'jenkins-whn-preprod',
                    accessKeyVariable: 'AWS_ACCESS_KEY_ID',
                    secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'
                )
            ]) {
                checkout scm
                stage("upload") {
                    container('main') {
                        copyArtifacts filter: "site.zip", fingerprintArtifacts: true, projectName: '${JOB_NAME}', selector: specific('${BUILD_NUMBER}')
                        unzip zipFile: 'site.zip', dir: 'public'
                            ansiColor('xterm') {
                                sh """
mc alias set minio https://s3.whn-preprod.hhome.me/ \$AWS_ACCESS_KEY_ID \$AWS_SECRET_ACCESS_KEY
pwd
ls
cd public
ls
mc cp * minio/static/${BRANCH_NAME}/
"""
                            }
                        }
                    }
                }
            }
        }

node() {
    stage('downstream') {
        when(BRANCH_NAME == 'master') {
            checkout scm
            result = sh (script: "git log -1 | grep '/publish'", returnStatus: true)
            if (result == 0) {
                withCredentials([
                    sshUserPrivateKey(
                        credentialsId: 'jenkins-ssh',
                        keyFileVariable: 'SSH_KEYFILE',
                        passphraseVariable: '',
                        usernameVariable: ''
                    )
                ]) {
                    sh '''
mkdir ~/.ssh
chmod 0700 ~/.ssh
ssh-keyscan -p 2252 gitea.hhome.me > ~/.ssh/known_hosts
echo "IdentityFile ${SSH_KEYFILE}" > ~/.ssh/config
git remote add gitea ssh://git@gitea.hhome.me:2252/sites/willhughes.name.git
git push -f gitea $(git rev-parse HEAD):published'''
                }
            }
            build job: 'Kubernetes/helm-configs/master', wait: false
        }
    }
}

awscli('jenkins-willhughes-name') {
    stage('publish') {
        container('main') {
            when(BRANCH_NAME == 'published') {
                copyArtifacts filter: 'site.zip', fingerprintArtifacts: true, projectName: '${JOB_NAME}', selector: specific('${BUILD_NUMBER}')
                unzip zipFile: 'site.zip', dir: 'public'
                sh 'aws s3 sync public/ s3://www.willhughes.name --exclude ".git/*" --exclude ".git*" --delete --cache-control max-age=43200'
            }
        }
    }
}

node() {
    stage('publish-github') {
        when(BRANCH_NAME == 'published') {
            checkout scm
            withCredentials([
                sshUserPrivateKey(
                    credentialsId: 'jenkins-willhughes-name-github',
                    keyFileVariable: 'SSH_KEYFILE',
                    passphraseVariable: '',
                    usernameVariable: ''
                    )
            ]) {
                sh '''
mkdir ~/.ssh
chmod 0700 ~/.ssh
ssh-keyscan github.com > ~/.ssh/known_hosts
echo "IdentityFile ${SSH_KEYFILE}" > ~/.ssh/config
git remote add github git@github.com:insertjokehere/willhughes.name.git
git push -f github $(git rev-parse HEAD):master'''
            }
        }
    }
}
