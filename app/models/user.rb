class User < ApplicationRecord
    has_secure_password
    has_many :requests, dependent: :destroy 
    has_many :volunteers, dependent: :destroy 
    has_many :volunteered_requests, :through => :volunteers, :source => :request
    
end
