class IndexController < ApplicationController
  def robots
    file_root = Rails.root.join("app", "assets")
    robots_file = if ENV["DISABLE_ROBOTS"] == "true"
                    file_root.join("robots.hide.txt")
                  else
                    file_root.join("robots.show.txt")
                  end
    render file: robots_file
  end

  def application_template; end
end
