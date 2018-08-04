source "https://rubygems.org"

ruby File.read(File.dirname(__FILE__) + "/.ruby-version").strip

gem "autoprefixer-rails", "8.2.0"
gem "bcrypt", "~> 3.1.7"
gem "jbuilder", "~> 2.5"
gem "jwt", "~>1.5.6"
gem "knock", "~> 2.1", ">= 2.1.1"
gem "local_time", "~>2.0.1"
gem "pg", "~> 0.18"
gem "puma", "~> 3.0"
gem "rails", "~> 5.1.6"
gem "rails-controller-testing", "~> 1.0.1"
gem "resque", "~>1.27.4"
gem "resque-heroku-signals"
gem "rubyXL", "~> 3.3"
gem "sentry-raven"
gem "tzinfo-data", "~> 1.2017", ">= 1.2017.2"
gem "uglifier"

group :development, :test do
  gem "dotenv-rails"
  gem "factory_bot_rails", "~> 4.8"
  gem "pry"
  gem "pry-byebug"
  gem "pry-doc"

  gem "rack-cors"

  gem "rspec-rails"
  gem "rubocop", require: false
  gem "shoulda-matchers", git: "https://github.com/thoughtbot/shoulda-matchers.git", branch: "rails-5"
end

group :development do
  gem "listen", "~> 3.0.5"
  gem "spring"
  gem "spring-watcher-listen", "~> 2.0.0"
end

group :test do
  gem "database_cleaner", require: false
end
