# frozen_string_literal: true
Rails.application.routes.draw do

  require 'resque/server'
  mount Resque::Server, at: '/jobs'

  get 'application_template', to: 'index#application_template'
  get 'login', to: 'sessions#new'
  get 'logged_in', to: 'sessions#show'

  resources :challenges, only: [:new, :create, :update] do
    collection do
      get :evaluate
      get :completed
    end
  end

  resources :performances, only: [:create, :new, :index, :update, :destroy]
  get 'performances/:id/email_challenge_list', to: 'performances#email_challenge_list'

  resources :sessions, only: [:create]
  resources :user_challenges, only: [:destroy]
  resources :users do
    collection do
      get :search
    end
  end

  get 'logout', to: 'sessions#destroy'

  get 'robots.txt', to: 'index#robots'

  namespace :api do
    post 'user_token' => 'user_token#create'

    get 'users/can_challenge', to: 'users#can_challenge'
    put 'users/switch_spots', to: 'users#switch_spot'
    get 'users/search', to: 'users#search'
    resources :users, only: [:index, :show, :update], constraints: { id: /[a-zA-Z]+(?:-[a-zA-Z]+)?\.[0-9]+/ }
    get 'users/profile/:buck_id', to: 'users#profile', constraints: { buck_id: /[a-zA-Z]+(?:-[a-zA-Z]+)?\.[0-9]+/ }
    post 'users/:buck_id/reset_password', to: 'users#reset_password', constraints: { buck_id: /[a-zA-Z]+(?:-[a-zA-Z]+)?\.[0-9]+/ }
    post 'users/upload', to: 'users#upload'
    post 'users/create', to: 'users#create'

    get 'spots/find', to: 'spots#find'

    resources :challenges, only: [:create] do
      collection do
        get :for_approval
        get :for_evaluation
        get :completed
      end
      member do
        put :submit_evaluation
        put :approve
        put :disapprove
      end
    end
    resources :discipline_actions, only: [:create, :destroy]
    resources :user_challenges, only: [:create, :destroy] do
      collection do
        post 'comments', action: :evaluate_comments
        post 'places', action: :evaluate_places

        put 'comments', action: :update_comments
      end
    end
    resources :password_reset_requests, only: [:create, :show]

    resources :performances, only: [:create, :index, :update, :destroy] do
      collection do
        get 'challengeable_users'
      end
    end
    get 'performances/next', to: 'performances#next'
    get 'performances/:id/challenge_list', to: 'performances#challenge_list'
    get 'testing/exception', to: 'testing#exception'
  end

  root to: 'index#index'
  get '*path', to: 'index#index'
end
