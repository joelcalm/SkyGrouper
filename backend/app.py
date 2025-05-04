#backend/app.py

from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
import os
from datetime import datetime
import uuid
import json
from dotenv import load_dotenv


# at the very top of your file, before any os.getenv calls:
load_dotenv()

app = Flask(__name__)
CORS(app)

# now this will actually read from your .env file
mongo_uri = os.getenv("MONGO_URI")
app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)

# Collection reference
group_trips = mongo.db.groupTrips

@app.route('/api/group-trip', methods=['POST'])
def create_group_trip():
    """Create a new group trip with a unique code"""
    try:
        # Get data from request
        data = request.json or {}
        num_of_members = data.get('numOfMembers', 2)
        
        # Generate a unique group trip ID (a 6-character code)
        group_trip_id = str(uuid.uuid4())[:6].upper()
        
        # Create new group trip document
        new_trip = {
            "groupTripId": group_trip_id,
            "users": [],
            "createdAt": datetime.now(),
            "numOfMembers": num_of_members
        }
        
        # Insert into MongoDB
        result = group_trips.insert_one(new_trip)
        
        # Return the group trip ID for users to share
        return jsonify({
            "success": True,
            "groupTripId": group_trip_id,
            "message": "Group trip created successfully"
        }), 201
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error creating group trip: {str(e)}"
        }), 500

@app.route('/api/group-trip/<group_trip_id>/user', methods=['POST'])
def add_user_to_trip(group_trip_id):
    """Add or update a user's information in a group trip"""
    try:
        # Get data from request
        user_data = request.json
        
        # Generate a user ID if not provided
        if 'userId' not in user_data:
            user_data['userId'] = str(uuid.uuid4())
        
        # Set created timestamp and mark as incomplete by default
        user_data['createdAt'] = datetime.now()
        user_data['completed'] = False
        
        # Find the group trip
        group_trip = group_trips.find_one({"groupTripId": group_trip_id})
        
        if not group_trip:
            return jsonify({
                "success": False,
                "message": "Group trip not found"
            }), 404
        
        # Check if user already exists in this trip
        existing_user_index = None
        for i, user in enumerate(group_trip.get('users', [])):
            if user.get('userId') == user_data['userId']:
                existing_user_index = i
                break
        
        if existing_user_index is not None:
            # Update existing user
            result = group_trips.update_one(
                {"groupTripId": group_trip_id},
                {"$set": {f"users.{existing_user_index}": user_data}}
            )
        else:
            # Add new user
            result = group_trips.update_one(
                {"groupTripId": group_trip_id},
                {"$push": {"users": user_data}}
            )
        
        if result.modified_count > 0:
            return jsonify({
                "success": True,
                "userId": user_data['userId'],
                "message": "User information saved successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Failed to update group trip"
            }), 500
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error updating user information: {str(e)}"
        }), 500

@app.route('/api/group-trip/<group_trip_id>', methods=['GET'])
def get_group_trip(group_trip_id):
    """Get all information about a group trip"""
    try:
        group_trip = group_trips.find_one({"groupTripId": group_trip_id})
        
        if not group_trip:
            return jsonify({
                "success": False,
                "message": "Group trip not found"
            }), 404
        
        # Convert ObjectId to string for JSON serialization
        group_trip['_id'] = str(group_trip['_id'])
        
        return jsonify({
            "success": True,
            "groupTrip": group_trip
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error retrieving group trip: {str(e)}"
        }), 500

@app.route('/api/group-trip/<group_trip_id>/user/<user_id>/update-step', methods=['PATCH'])
def update_user_step(group_trip_id, user_id):
    """Update a specific step of the user's trip planning process"""
    try:
        # Get step data from request
        step_data = request.json
        step_name = step_data.get('step')
        step_value = step_data.get('value')
        
        if not step_name or step_value is None:
            return jsonify({
                "success": False,
                "message": "Missing step name or value"
            }), 400
        
        # Find the group trip and the user
        group_trip = group_trips.find_one({"groupTripId": group_trip_id})
        
        if not group_trip:
            return jsonify({
                "success": False,
                "message": "Group trip not found"
            }), 404
        
        # Find user index
        user_index = None
        for i, user in enumerate(group_trip.get('users', [])):
            if user.get('userId') == user_id:
                user_index = i
                break
        
        if user_index is None:
            return jsonify({
                "success": False,
                "message": "User not found in this group trip"
            }), 404
        
        # Update the specific step
        update_field = f"users.{user_index}.{step_name}"
        result = group_trips.update_one(
            {"groupTripId": group_trip_id},
            {"$set": {update_field: step_value}}
        )
        
        if result.modified_count > 0:
            return jsonify({
                "success": True,
                "message": f"Step '{step_name}' updated successfully"
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "No changes were made"
            }), 400
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error updating user step: {str(e)}"
        }), 500

@app.route('/api/group-trip/<group_trip_id>/user/<user_id>/complete', methods=['PATCH'])
def mark_user_complete(group_trip_id, user_id):
    """Mark a user's trip planning as completed"""
    try:
        # Find the user in the group trip
        group_trip = group_trips.find_one({"groupTripId": group_trip_id})
        
        if not group_trip:
            return jsonify({
                "success": False,
                "message": "Group trip not found"
            }), 404
        
        # Find user index
        user_index = None
        for i, user in enumerate(group_trip.get('users', [])):
            if user.get('userId') == user_id:
                user_index = i
                # Check if user is already completed
                if user.get('completed') == True:
                    return jsonify({
                        "success": True,
                        "message": "User already marked as completed"
                    }), 200
                break
        
        if user_index is None:
            return jsonify({
                "success": False,
                "message": "User not found in this group trip"
            }), 404
        
        # Update completed status
        result = group_trips.update_one(
            {"groupTripId": group_trip_id},
            {"$set": {f"users.{user_index}.completed": True}}
        )
        
        # Return success even if no changes were made (idempotent operation)
        return jsonify({
            "success": True,
            "message": "User marked as completed"
        }), 200
            
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Error marking user complete: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)