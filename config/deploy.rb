# config valid only for Capistrano 3.1
# lock '3.2.1'

set :application, 'narcissus'
set :deploy_user, 'ubuntu'

set :scm, :git
set :repo_url, 'https://luoguanzhong:96f7bbc595b894e749ffc631ab7588360fe74a55@github.com/hilotus/narcissus.git'
set :branch, 'master'

set :keep_releases, 5

# set(:linked_files, %w(config/mongoid.yml))

# set :linked_dirs, %w{bin log tmp/pids tmp/cache tmp/sockets vendor/bundle public/system}
set :linked_dirs, %w{bin log tmp vendor/bundle public/system}

# without any test
# set :tests, %w(spec)
set :tests, []

# custom configuration
set(:config_files, %w(
  nginx.conf
))

# set(:executable_config_files, %w(unicorn_init.sh))
set :executable_config_files, []

set(:symlinks, [
  {
    source: "nginx.conf",
    link: "/etc/nginx/sites-enabled/{{full_app_name}}"
  }
])

namespace :deploy do
  # only allow a deploy with passing tests to deployed
  before :deploy, "deploy:setup_config"

  after 'deploy:symlink:shared', 'deploy:compile_assets_locally'

  after :deploy, 'nginx:restart'

  after :rollback, 'nginx:restart'

  after :finishing, 'deploy:cleanup'
end