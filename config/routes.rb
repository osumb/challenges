# frozen_string_literal: true
Rails.application.routes.draw do
  scope :api do
    post 'user_token' => 'user_token#create'

    resources :users, only: [:index, :show], constraints: { id: /[0-z\.]+/ }
  end

  get '*path', to: 'index#index'
end
