set :server_name, 'www.hilotus.com'

set :full_app_name, "#{fetch(:application)}"

server 'www.hilotus.com', user: 'ubuntu', roles: %w{web app db}, primary: true

set :deploy_to, "/home/#{fetch(:deploy_user)}/apps/#{fetch(:full_app_name)}"

set :shared_path, "#{fetch(:deploy_to)}/shared"

set :environment, :production

set :enable_ssl, false