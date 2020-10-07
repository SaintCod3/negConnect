class Request < ApplicationRecord
    belongs_to :request_type
    has_many :chats, dependent: :destroy 
    belongs_to :status
    has_many :volunteers, dependent: :destroy 
    belongs_to :user
    has_many :conversations, dependent: :destroy 
end