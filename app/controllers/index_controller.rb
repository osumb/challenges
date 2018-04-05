class IndexController < ApplicationController
  def index
    render file: Rails.root.join('public', 'index.html')
  end

  def robots
    file_root = Rails.root.join('client', 'public')
    robots_file = if ENV['DISABLE_ROBOTS'] == 'true'
                    file_root.join('robots.hide.txt')
                  else
                    file_root.join('robots.show.txt')
                  end
    render file: robots_file
  end

  def application_template; end
end
