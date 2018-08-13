require_relative 'boot'
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

    config.action_view.logger = nil

    config.active_job.queue_adapter = :resque

    config.action_mailer.perform_deliveries = ENV["SEND_EMAILS"] == "true"

    config.action_mailer.asset_host = ENV["APPLICATION_URL"]

    config.assets.paths << Rails.root.join("vendor", "assets", "*")

    config.autoload_paths << Rails.root.join("app", "views", "helpers", "*")

    config.action_controller.include_all_helpers = true
  end
end
