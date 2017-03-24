ENV['RAILS_ENV'] ||= 'test'
ActiveRecord::Migration.maintain_test_schema!

# code coverage tools
require 'coveralls'
Coveralls.wear! 'rails'

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'
require 'database_cleaner'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  include FactoryGirl::Syntax::Methods

  DatabaseCleaner.strategy = :truncation
  DatabaseCleaner.logger = Rails.logger

  setup { DatabaseCleaner.start }

  teardown { DatabaseCleaner.clean }
end
