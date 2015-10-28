Compute::Engine.routes.draw do
  scope "/:domain_id/:project_id" do
    resources :instances, except: [:edit, :update] do
      member do
        get 'update_item'
        put 'stop'
        put 'start'
        put 'pause'
        put 'suspend'
        put 'resume'
        put 'reboot'
      end
    end
  end              
end
