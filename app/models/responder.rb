class Responder < ApplicationRecord
    belongs_to :request, optional: true
end
