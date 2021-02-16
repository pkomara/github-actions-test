node (label: 'ci-vm114') {
    properties([
        buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '30', numToKeepStr: '45')),
        disableConcurrentBuilds(),
        disableResume(),
        [$class: 'GithubProjectProperty', displayName: '', projectUrlStr: 'https://git.scm.genesys.com/Genesys/registrar_node/']
    ])

    def CHECKMARX_PROJECT_NAME = "Registrar_node_1.0.0"
    def DEV_REGISTRY = "pureengage-docker-dev.jfrog.io"
    def DEV_REGISTRY_CREDS = "pipeline-dev"
    def DEV_REPOSITORY = "docker-dev"
    def DEV_ARTIFACTORY = "artifactory_dev"
    // Artifactory settings for Staging builds - branch=master
    def STAGING_REGISTRY = "pureengage-docker-staging.jfrog.io"
    def STAGING_REGISTRY_CREDS = "pipeline-staging"
    def STAGING_REPOSITORY = "docker-staging"
    def STAGING_ARTIFACTORY = "artifactory_staging"

    //hosted registry 
    def LOCAL_REGISTRY = "ci-vm114.us.int.genesyslab.com:80"

    // Branch based settings
    def REGISTRY
    def REGISTRY_CREDS
    def REPOSITORY
    // TEMP HACK - setup pointer to Azure Dev ACR
    def REGISTRY_ACR = "inboundservices.azurecr.io"
    // Build settings
    //TODO remove PUBLISH_TO_ARTIFACTORY, by default push to dev artifact
    //def PUBLISH_TO_ARTIFACTORY = "${params.PUBLISH_TO_ARTIFACTORY}"
    def PUBLISH_TO_ARTIFACTORY = true
    def artifactory
    def adocker
    def server
    def buildInfo = Artifactory.newBuildInfo()
    def scmVars
    def katana_scmVars
    def commitHash
    def BASE_IMAGE = "pureengage-docker-staging.jfrog.io/base/ubi8-node14:latest"
    def IMAGE_REPO = "voice"
    def IMAGE_NAME = "registrar_node"
    def BUILD_TIME_ISO8601M
    def BUILD_VERSION
    def IMAGE_VERSION = null
    def COMMIT_HASH
    def IMAGE_FREEZE = false
    def TIMESTAMP
    def FREEZE_VERSION
    def AUTHOR_EMAIL = "defaultValue"

    // For unit testing the image
    def nodeApp

    def notifications

    try {
        stage('Initialization') {
            // format like Zen Timestamp in UTC - 201904291311
            // BUILD_TIME_ISO8601M = sh(returnStdout: true, script: 'date -u "+%Y%m%d%H%M"').trim()
            // format in UTC - 2019-04-29T13:11+0000
            BUILD_TIME_ISO8601M = sh(returnStdout: true, script: 'date --iso-8601=minutes').trim()
            TIMESTAMP= sh(returnStdout: true, script: 'date +%y%m%d%H%M%S').trim()
            // As an example, we're using the MonthOfTheYear as our iteration, but this will vary by teams
            def VERSION_ITER = sh(returnStdout: true, script: 'date -u "+%m"').trim()
            def VERSION_PATCH = "${BUILD_NUMBER}"
                
            
            scmVars = checkout scm
            echo "scmVars = ${scmVars}"
            commitHash = scmVars.GIT_COMMIT
            env.BUILD_TIME_ISO8601M=BUILD_TIME_ISO8601M
            env.GIT_BRANCH=scmVars.GIT_BRANCH
            env.GIT_COMMIT=scmVars.GIT_COMMIT
            env.GIT_URL=scmVars.GIT_URL
            env.TIMESTAMP=TIMESTAMP
            COMMIT_HASH=scmVars.GIT_COMMIT.toString()[0..6]
            echo "COMMIT_HASH=${COMMIT_HASH}"
            IMAGE_VERSION="latest-${COMMIT_HASH}"
            echo "IMAGE_VERSION=${IMAGE_VERSION}"

            env.IMAGE_VERSION=IMAGE_VERSION

            
            //prepare ssh-keys for git.scm repositories. TODO: git path may vary for different nodes
            PUBLIC_KEY = sh(returnStdout: true, script: 'cat /home/cisrvsys/.ssh/id_rsa.pub')
            PRIVATE_KEY = sh(returnStdout: true, script: 'cat /home/cisrvsys/.ssh/id_rsa')
            env.SSH_PRIVATE_KEY=PRIVATE_KEY
            env.SSH_PUBLIC_KEY=PUBLIC_KEY
            // import Notifications.groovy script for PureCloud Collaborate
            //notifications = load 'Notifications.groovy'

            echo "Setting IMAGE_REPO=${IMAGE_REPO}"
            env.IMAGE_REPO=IMAGE_REPO
            echo "Setting IMAGE_NAME=${IMAGE_NAME}"
            env.IMAGE_NAME=IMAGE_NAME

            
            // Label the Jenkins build w/ the branch
            currentBuild.description = scmVars.GIT_BRANCH + " - " + IMAGE_VERSION

                    }
 

        stage('Update, Create PR ')
        {
            sh '''
                rm -rf $WORKSPACE/voice-registrar-pipeline
                mkdir $WORKSPACE/voice-registrar-pipeline
            '''

            pipeline_scmVars = checkout([$class: 'GitSCM', 
            branches: [[name: 'master']],
            doGenerateSubmoduleConfigurations: false, 
            extensions: [[$class: 'RelativeTargetDirectory', 
            relativeTargetDir: "voice-registrar-pipeline"]], 
            submoduleCfg: [],
            userRemoteConfigs: [[credentialsId: 'voice-github' , url: 'https://github.com/genesysengage/voice-registrar-pipeline.git']]])

            //Update latest image version in helmvalues/azure/dev/westus2/values.yaml for spinnaker
            //TODO more than one region folder present add entry(s) with correct path
            //UPDATE_REPO = sh(script: "sed -ri 's/^(\\s*)(\"version\":\\s)/\\1\"version\":\"'${IMAGE_VERSION}'\"/' ${WORKSPACE}/voice-registrar-pipeline/helmvalues/azure/dev/versions.json", returnStatus: true)

            withCredentials([usernamePassword(credentialsId: 'voice-github', passwordVariable: 'GITHUB_TOKEN', usernameVariable: 'GITHUB_USERNAME')])
            {
                sh '''
                    cd $WORKSPACE/voice-registrar-pipeline
                    git remote set-url origin https://$GITHUB_USERNAME:$GITHUB_TOKEN@github.com/genesysengage/voice-registrar-pipeline.git
                    git checkout master
                    TIMESTAMP=$(date +%H_%M_%S)
                    git checkout -b dev-$IMAGE_VERSION
                '''
            }
            
            def versionJson = readJSON file: "${WORKSPACE}/voice-registrar-pipeline/helmvalues/azure/dev/westus2/versions.json"
            def helmVersion = versionJson['helm_version']
            script{ chartYaml = readYaml file: "${WORKSPACE}/voice-registrar-pipeline/helmcharts/voice-registrar/Chart.yaml" }

            writeFile(
                    file: "${WORKSPACE}/voice-registrar-pipeline/helmvalues/azure/dev/westus2/versions.json",
                    text: """\
                    {
                    "version":"${IMAGE_VERSION}",
                    "helm_version":"${helmVersion}"
                    }
                    """.stripIndent()
            )
            def appVersion =${IMAGE_VERSION}
            println appVersion
            chartYaml.appVersion =appVersion
            sh "rm ${WORKSPACE}/voice-registrar-pipeline/helmcharts/voice-registrar/Chart.yaml"
            writeYaml file: "${WORKSPACE}/voice-registrar-pipeline/helmcharts/voice-registrar/Chart.yaml", data: chartYaml
            sh "cat ${WORKSPACE}/voice-registrar-pipeline/helmcharts/voice-registrar/Chart.yaml"

            def isChanged = sh(returnStdout: true, script: '''
            cd ${WORKSPACE}/voice-registrar-pipeline/
            git status -s
            ''')
            def create_pr = (isChanged?.trim())

        }


    } catch(error) {
          currentBuild.result = 'FAILURE'
          echo 'ERROR ENCOUNTERED IN BUILD'
          echo "ERROR DETAILS: ${error}"
    }
}
