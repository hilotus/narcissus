namespace :deploy do
  desc "compiles assets locally then rsyncs"
  task :compile_assets_locally do
    run_locally do
      execute "ember build --environment #{fetch(:environment)}"
    end
    on roles(:app) do |role|
      run_locally do
        execute "rsync -av ./dist/ #{role.user}@#{role.hostname}:#{release_path}/public/;"
      end
      sudo "chmod -R 755 #{release_path}/public/"
    end
    run_locally do
      execute "rm -rf ./dist"
    end
  end
end