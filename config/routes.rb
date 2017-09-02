# frozen_string_literal: true
Rails.application.routes.draw do
  scope :api do
    post 'user_token' => 'user_token#create'

    get 'users/can_challenge', to: 'users#can_challenge'
    put 'users/switch_spots', to: 'users#switch_spot'
    get 'users/search', to: 'users#search'
    resources :users, only: [:index, :show, :update], constraints: { id: /[0-z\.]+/ }
    get 'users/profile/:buck_id', to: 'users#profile', constraints: { buck_id: /[0-z\.]+/ }
    post 'users/:buck_id/reset_password', to: 'users#reset_password', constraints: { buck_id: /[0-z\.]+/ }
    post 'users/upload', to: 'users#upload'

    resources :challenges, only: [:create] do
      collection do
        get :for_approval
        get :for_evaluation
        get :completed
      end
      member do
        put :submit_for_approval
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
  end

  get '*path', to: 'index#index'
  root to: 'index#index'
end
