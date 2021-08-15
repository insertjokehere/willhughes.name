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

minioCli('jenkins-whn-preprod') {
    stage("publish-preprod") {
        when(BRANCH_NAME == 'master' || BRANCH_NAME == 'published') {
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
mc mirror --overwrite . minio/static/
"""
                }
            }
        }
    }
}

node() {
    stage('publish-git') {
        when(BRANCH_NAME == 'master') {
            checkout scm
            result = sh (script: "git log -1 | grep '/publish'", returnStatus: true)
            if (result == 0) {
                gitReplicate('jenkins-ssh', 'ssh://git@gitea.hhome.me:2252/sites/willhughes.name.git', 'published', '-p 2252 gitea.hhome.me')
            }
        }
    }
}

awscli('jenkins-willhughes-name') {
    stage('publish-s3') {
        container('main') {
            when(BRANCH_NAME == 'published') {
                copyArtifacts filter: 'site.zip', fingerprintArtifacts: true, projectName: '${JOB_NAME}', selector: specific('${BUILD_NUMBER}')
                unzip zipFile: 'site.zip', dir: 'public'
                sh 'aws s3 sync public/ s3://www.willhughes.name --exclude ".git/*" --exclude ".git*" --delete --cache-control max-age=43200'
                sh 'aws cloudfront create-invalidation --distribution-id EA06J9WB5EOXF --paths "/*"'
            }
        }
    }
}

node() {
    stage('publish-github') {
        when(BRANCH_NAME == 'published') {
            checkout scm
            gitReplicate('jenkins-willhughes-name-github', 'git@github.com:insertjokehere/willhughes.name.git', 'master', 'github.com')
        }
    }
}
