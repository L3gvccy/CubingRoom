import Loader from "@/components/loader/loader";
import UserAvatar from "@/components/user-avatar";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_USER_ROUTE } from "@/utils/constants";
import React, { useState, useEffect } from "react";
import { IoMdArrowBack, IoMdCheckmark } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { MdModeEdit } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const Profile = () => {
  const { userData } = useAppStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const [editable, setEditable] = useState(false);
  const { id } = useParams();

  const [editingName, setEditingName] = useState();
  const [newName, setNewName] = useState(userData.displayName);

  const getUser = async () => {
    await apiClient
      .get(`${GET_USER_ROUTE}/${id}`, { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setEditable(res.data.editable);
      })
      .catch((err) => {
        if (err.response.status !== 500) {
          toast.error(err.response?.data);
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelNameEdit = () => {
    setEditingName(false);
    setNewName(userData.displayName);
  };

  const handleNameEdit = async () => {
    if (newName === userData.displayName) {
      setEditingName(false);
      return;
    }
    await apiClient.post();
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading)
    return (
      <div className="flex bg-zinc-900 w-full min-h-screen items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <>
      <div className="bg-zinc-900 w-full min-h-screen p-4 relative flex justify-center">
        <div
          className="absolute top-4 left-4 text-xl text-zinc-400 hover:text-zinc-300 active:text-zinc-500 transition-all duration-300 cursor-pointer"
          onClick={() => {
            navigate(-1);
          }}
        >
          <IoMdArrowBack />
        </div>
        <div className="flex flex-col gap-3 items-center max-w-342 w-full">
          <UserAvatar size={"xl2"} image={user.image} />
          {editingName ? (
            <div className="flex gap-2 items-center">
              <input
                className="text-xl border-b border-zinc-100/50"
                type="text"
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
              />
              <div
                className="text-xl text-zinc-500 hover:text-zinc-400 cursor-pointer"
                onClick={cancelNameEdit}
              >
                <IoClose />
              </div>
              <div
                className="text-xl text-zinc-500 hover:text-zinc-400 cursor-pointer"
                onClick={handleNameEdit}
              >
                <IoMdCheckmark />
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center">
              <p className="text-3xl font-semibold">{user.displayName}</p>
              {editable && (
                <div
                  className="text-xl text-zinc-500 hover:text-zinc-400 transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    setEditingName(true);
                  }}
                >
                  <MdModeEdit />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
