const express = require('express');
const Group = require('../Model/Group');
const Message = require('../Model/Message');
const router = express.Router();

module.exports = function(io) {
  // Get user's groups by email
  router.get('/my-groups/:userEmail', async (req, res) => {
    try {
      const { userEmail } = req.params;
      
      const groups = await Group.find({ members: userEmail }).lean();
      
      res.json(groups || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
      res.status(500).json({ 
        error: 'Failed to fetch groups',
        details: err.message
      });
    }
  });
  
  // Create group with emails
  router.post('/create-group', async (req, res) => {
    try {
      const { name, members, creatorEmail } = req.body;
      
      if (!name || !Array.isArray(members)) {
        return res.status(400).json({ error: 'Invalid input data' });
      }

      const group = new Group({ 
        name, 
        members: [...new Set([...members, creatorEmail])]
      });
      
      await group.save();
      
      io.emit('group_created', group);
      
      res.status(201).json(group);
    } catch (err) {
      console.error('Error creating group:', err);
      res.status(500).json({ 
        error: 'Failed to create group',
        details: err.message
      });
    }
  });

  // Get group messages
  router.get('/messages/:groupId', async (req, res) => {
    try {
      const messages = await Message.find({ group: req.params.groupId })
        .sort({ timestamp: 1 })
        .lean();
      
      res.status(200).json(messages);
    } catch (err) {
      console.error('Error fetching messages:', err);
      res.status(500).json({ 
        error: 'Failed to fetch messages',
        details: err.message
      });
    }
  });

  // Send message
  router.post('/send-message', async (req, res) => {
    try {
      const { groupId, content, senderEmail } = req.body;

      if (!groupId || !content || !senderEmail) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      const message = new Message({
        sender: senderEmail,
        group: groupId,
        content,
        readBy: [{ userEmail: senderEmail }]
      });

      await message.save();

      const messageToSend = {
        ...message.toObject(),
        _id: message._id,
        timestamp: message.timestamp
      };

      io.to(groupId).emit('receive_message', messageToSend);
      
      res.status(201).json(messageToSend);
    } catch (err) {
      console.error('Error sending message:', err);
      res.status(500).json({ 
        error: 'Failed to send message',
        details: err.message
      });
    }
  });

  // Mark messages as read
  router.post('/mark-read', async (req, res) => {
    try {
      const { messageIds, groupId, readerEmail } = req.body;
      
      if (!Array.isArray(messageIds)) {
        return res.status(400).json({ error: 'messageIds must be an array' });
      }

      await Message.updateMany(
        { _id: { $in: messageIds }, group: groupId },
        { $addToSet: { readBy: { userEmail: readerEmail } } }
      );

      io.to(groupId).emit('messages_read', { 
        messageIds, 
        readerEmail,
        timestamp: new Date()
      });
      
      res.status(200).json({ success: true });
    } catch (err) {
      console.error('Error marking messages as read:', err);
      res.status(500).json({ 
        error: 'Failed to mark messages as read',
        details: err.message
      });
    }
  });


  // Add member to group
router.post('/add-member/:groupId', async (req, res) => {
    try {
      const { groupId } = req.params;
      const { memberEmail } = req.body;
  
      if (!memberEmail) {
        return res.status(400).json({ error: 'Member email is required' });
      }
  
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
  
      if (group.members.includes(memberEmail)) {
        return res.status(400).json({ error: 'Member already in group' });
      }
  
      group.members.push(memberEmail);
      await group.save();
  
      io.emit('member_added', group);
      
      res.status(200).json(group);
    } catch (err) {
      console.error('Error adding member:', err);
      res.status(500).json({ 
        error: 'Failed to add member',
        details: err.message
      });
    }
  });
  return router;
};