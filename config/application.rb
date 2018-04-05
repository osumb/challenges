require_relative 'boot'
require_relative '../app/middleware/new_token_middleware'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Challenges
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    config.generators do |g|
      g.test_framework  :rspec
    end

    config.middleware.use NewTokenMiddleware

    config.action_view.logger = nil

    config.active_job.queue_adapter = :resque

    config.action_mailer.perform_deliveries = ENV["SEND_EMAILS"] == "true"
  end
end
