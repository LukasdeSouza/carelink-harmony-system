
import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useFlow } from "@/contexts/FlowContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { currentUser, setCurrentUser } = useFlow();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
      });
      
      // Fetch avatar if exists
      fetchAvatar();
    }
  }, [currentUser]);

  const fetchAvatar = async () => {
    if (!currentUser?.id) return;
    
    try {
      const { data, error } = await supabase
        .storage
        .from('avatars')
        .download(`${currentUser.id}`);
        
      if (error) {
        console.error('Error downloading avatar:', error);
        return;
      }
      
      if (data) {
        const url = URL.createObjectURL(data);
        setAvatarUrl(url);
      }
    } catch (error) {
      console.error('Error fetching avatar:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }
      
      setAvatarFile(file);
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile || !currentUser?.id) return false;
    
    try {
      const { error } = await supabase
        .storage
        .from('avatars')
        .upload(`${currentUser.id}`, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        });
        
      if (error) {
        console.error('Error uploading avatar:', error);
        toast.error("Failed to upload profile picture");
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in avatar upload:', error);
      return false;
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Upload avatar if changed
      if (avatarFile) {
        const avatarUploaded = await uploadAvatar();
        if (!avatarUploaded) {
          setIsLoading(false);
          return;
        }
      }
      
      // Update user profile in database
      const { data, error } = await supabase
        .from('users')
        .update({
          name: formData.name,
          bio: formData.bio,
        })
        .eq('id', currentUser?.id)
        .select()
        .single();
        
      if (error) {
        throw error;
      }
      
      // Update email if changed
      if (formData.email !== currentUser?.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email,
        });
        
        if (emailError) {
          throw emailError;
        }
        
        toast.success("Verification email sent. Please check your inbox.");
      }
      
      // Update local user state
      if (data && currentUser) {
        setCurrentUser({
          ...currentUser,
          name: data.name,
          email: formData.email, // We use the form data since the email update is async
          bio: data.bio,
        });
      }
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Password updated successfully");
      setIsPasswordDialogOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p>Please login to view your profile</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container max-w-4xl mx-auto py-6 space-y-8">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          <div className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative w-40 h-40 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <User className="h-20 w-20 text-gray-400" />
                  </div>
                )}
                
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-2 right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90"
                >
                  <Camera className="h-4 w-4" />
                </label>
                <input 
                  type="file" 
                  id="avatar-upload" 
                  accept="image/*" 
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              
              <div className="text-center">
                <h3 className="font-medium text-lg">{currentUser.name}</h3>
                <p className="text-gray-500 text-sm">{currentUser.email}</p>
                <p className="mt-1 text-sm bg-gray-100 px-2 py-1 rounded">
                  {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                  {currentUser.super_admin && " (Super Admin)"}
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={() => setIsPasswordDialogOpen(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Your full name" 
                    value={formData.name} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="your.email@example.com" 
                    value={formData.email} 
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Changing your email will require verification
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    name="bio" 
                    placeholder="A short bio about yourself" 
                    value={formData.bio || ""}
                    onChange={handleInputChange}
                    rows={4}
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
      
      {/* Password Change Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handlePasswordUpdate} className="space-y-4">
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input 
                  id="currentPassword" 
                  name="currentPassword" 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input 
                  id="newPassword" 
                  name="newPassword" 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
};

export default ProfilePage;
