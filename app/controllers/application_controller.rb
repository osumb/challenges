# frozen_string_literal: true
class ApplicationController < ActionController::API
  include Knock::Authenticable
end
