require 'simplecov'
SimpleCov.start

require 'codecov'
SimpleCov.formatter = SimpleCov::Formatter::Codecov

ENV['RAILS_ENV'] ||= 'test'
ActiveRecord::Migration.maintain_test_schema!

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'database_cleaner'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  def authenticated_header(user)
    token = Knock::AuthToken.new(payload: user.to_token_payload).token

    {
      'Accept': 'application/json, text/html',
      'Authorization': "Bearer #{token}",
      'CONTENT_TYPE' => 'application/json',
      'ACCEPT' => 'application/json'
    }
  end

  def unauthenticated_header
    {
      'Accept': 'application/json, text/html',
      'CONTENT_TYPE' => 'application/json',
      'ACCEPT' => 'application/json'
    }
  end

  include FactoryGirl::Syntax::Methods

  DatabaseCleaner.strategy = :truncation
  DatabaseCleaner.logger = Rails.logger

  setup { DatabaseCleaner.start }

  teardown { DatabaseCleaner.clean }
end
