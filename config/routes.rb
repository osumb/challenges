# frozen_string_literal: true
Rails.application.routes.draw do

  require 'resque/server'
  mount Resque::Server, at: '/jobs'

  get 'application_template', to: 'index#application_template'
  get 'login', to: 'sessions#new'
  get '/', to: 'sessions#show'
  post 'reset_data', to: 'reset_data#reset_data'
  get 'testing/exception', to: 'testing#exception'

  resources :challenges, only: [:new, :create, :update] do
    collection do
      get :evaluate
      get :completed
    end
  end

  resources :discipline_actions, only: [:create, :destroy]
  resources :password_reset_requests, only: [:create, :new, :show] do
    member do
      post :reset
    end
  end
  resources :performances, only: [:create, :new, :index, :update, :destroy]
  get 'performances/:id/email_challenge_list', to: 'performances#email_challenge_list'

  resources :sessions, only: [:create]
  resources :user_challenges, only: [:destroy]
  resources :users, only: [:create, :index, :new, :show, :update], constraints: { id: /[a-zA-Z]+(?:-[a-zA-Z]+)?\.[0-9]+/ } do
    member do
      post :switch_spot
    end

    collection do
      get :search
      get :upload
    end
  end

  get 'logout', to: 'sessions#destroy'

  get 'robots.txt', to: 'index#robots'

  root to: 'index#index'
  get '*path', to: 'index#index'
end
