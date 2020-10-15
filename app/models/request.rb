class Request < ApplicationRecord
    geocoded_by :city, :latitude  => :lat, :longitude => :lng
    belongs_to :request_type
    has_many :chats, dependent: :destroy 
    belongs_to :status
    has_many :volunteers, dependent: :destroy 
    belongs_to :user
    has_many :conversations, dependent: :destroy 
    validates :description, length: {in: 1..300}
    validates :user_id, :description, :request_type_id, :status_id, :lat, :lng, :req_time,  presence: true
end