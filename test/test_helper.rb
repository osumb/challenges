ENV['RAILS_ENV'] ||= 'test'
# code coverage tools
require 'simplecov'
SimpleCov.start
require 'coveralls'
Coveralls.wear!

require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  include FactoryGirl::Syntax::Methods
  # Add more helper methods to be used by all tests here...
end
