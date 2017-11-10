require 'resque/server'

Resque.redis = Redis.new(url: ENV['REDIS_URL'])

Resque.logger.level = Logger::DEBUG

Resque::Server.use Rack::Auth::Basic do |username, password|
  password = ENV['RESQUE_PASSWORD']
end
