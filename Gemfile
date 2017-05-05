# rubocop:disable Style/FileName
source 'https://rubygems.org'

ruby '2.4.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.0.1'
# Use postgresql as the database for Active Record
gem 'pg', '~> 0.18'
# Use Puma as the app server
gem 'puma', '~> 3.0'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.5'
# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'
# Parse xlsx files for data seeding and mass user upload
gem 'rubyXL', '~> 3.3'
# JWT auth library for user authentication
gem 'knock', '~> 2.1', '>= 2.1.1'

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platform: :mri
  gem 'dotenv-rails'
  gem 'factory_girl_rails', '~> 4.8'
  gem 'pry'
  gem 'pry-byebug'
  gem 'pry-doc'

  # Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
  gem 'rack-cors'

  gem 'rspec-rails'
  gem 'rubocop', require: false
  gem 'shoulda-matchers', git: 'https://github.com/thoughtbot/shoulda-matchers.git', branch: 'rails-5'
end

group :development do
  gem 'listen', '~> 3.0.5'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
  gem 'codecov', require: false
  gem 'database_cleaner', require: false
end
