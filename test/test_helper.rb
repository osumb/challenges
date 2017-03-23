ENV['RAILS_ENV'] ||= 'test'
ActiveRecord::Migration.maintain_test_schema!

# code coverage tools
require 'simplecov'
SimpleCov.start
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

  load Rails.root.join('db', 'seeds.rb') unless ENV['TRAVIS']

  setup { DatabaseCleaner.start }

  teardown { DatabaseCleaner.clean }
end
