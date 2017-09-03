# frozen_string_literal: true
class IndexController < ApplicationController
  def index
    render file: Rails.root.join('public', 'index.html')
  end
end
