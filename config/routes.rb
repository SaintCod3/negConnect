Rails.application.routes.draw do
 
  namespace :api do
    namespace :v1 do
      resources :users, only: %i[ index create show update] 
      put "/users/:id/avatar", to: "users#avatarUpload"
      put "/users/:id/govID", to: "users#govIDUpload"
      post "/login", to: "users#login"
      post "/register", to: "users#create"
      get 'my_requests', to: "requests#my_requests"
      post "rails/active_storage/direct_upload", to: "direct_upload#create"
      get "requests_voluntereed", to: "requests#requests_voluntereed"
      get "my_disabled_requests", to: "requests#my_disabled_requests"
      get "counter", to: "requests#counter"
      post "reset_request", to: "requests#reset_request"
      resources :requests, only: [:index, :show, :create, :destroy, :update] do
        
        resources :volunteers, only:  [:index, :show, :create, :destroy, :update]
        resources :chats, only: [:index, :show, :create, :destroy, :update]
        resources :conversations, only: [:index, :show , :create, :destroy, :update] do
         resources :messages, only: [:create]
        end
      end

      resources :statuses, only: [:create, :index,:show, :edit, :update, :destroy]
      resources :request_types, only: [:create, :index,:show, :edit, :update, :destroy]
     
    end
  end
  root 'pages#index'
  get '*path', to:'pages#index', constraints: lambda { |req| req.path.exclude? 'rails/active_storage' }
end
