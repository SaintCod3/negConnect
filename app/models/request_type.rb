class RequestType < ApplicationRecord
    has_many :requests, dependent: :destroy 
end
