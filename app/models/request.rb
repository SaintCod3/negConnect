class Request < ApplicationRecord
    belongs_to :request_type
    has_many :chats, dependent: :destroy 
    belongs_to :status
    has_many :volunteers, dependent: :destroy 
    belongs_to :user
    has_many :conversations, dependent: :destroy 
    
    #after_create do 
    #  UpdateStatus.set(wait: 1.minute).perform_later(request_id, status_id)
    #end 
end

#(request_id, status_id)
#    Request.find(request_id).update(status_id: 2)
# end