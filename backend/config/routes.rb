Rails.application.routes.draw do

  resources :property_images, except: [:new, :edit]
  resources :properties, except: [:new, :edit]
  resources :images, except: [:new, :edit]
  get    'signup'  => 'users#new'
  get    'login'   => 'sessions#new'
  post   'login'   => 'sessions#create'
  delete 'logout'  => 'sessions#destroy'
  get    'verify'  => 'sessions#verify_access_token'
  resources :users
  resources :password_resets, only: [:new, :create, :edit, :update]
  root 'welcome#welcome'

  namespace :api do
    post   'login'   => 'sessions#create'
    delete 'logout'  => 'sessions#destroy'
    get    'verify'  => 'sessions#verify_access_token'
    post   'create'  => 'properties#create'
    resources :users, param: :access_token
    resources :password_resets, only: [:new, :create, :edit, :update]
  end

end
