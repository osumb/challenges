# frozen_string_literal: true
Rails.application.routes.draw do
  scope :api do
    post 'user_token' => 'user_token#create'

    resources :users, only: [:index, :show], constraints: { id: /[0-z\.]+/ }
    get 'users/profile/:id', to: 'users#profile', constraints: { id: /[0-z\.]+/ }

    resources :challenges, only: [:create]
    resources :user_challenges, only: [:create, :destroy]
    resources :password_reset_requests, only: [:create, :show]

    resources :performances, only: [:create] do
      collection do
        get 'challengeable_users'
      end
    end
  end

  get '*path', to: 'index#index'
  root to: 'index#index'
end
