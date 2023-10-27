import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ConfigModalProps {
  closeConfigModal: () => void;
  saveConfig: (
    twitchUser: string,
    youtubeVideoId: string,
    youtubeApiKey: string,
    kickUser: string
  ) => void;
  defaultValues: {
    twitchUser: string;
    youtubeVideoId: string;
    youtubeApiKey: string;
    kickUser: string;
  };
}

interface ConfigInputProps {
  label: string;
  value: string;
  required: boolean;
  onChange: (value: string) => void;
}

const ConfigInput: React.FC<ConfigInputProps> = ({
  label,
  value,
  required,
  onChange,
}) => (
  <>
    <Label htmlFor={label}>{label}</Label>
    <Input
      id={label}
      placeholder={`Enter your ${label}`}
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
    />
  </>
);

export const ConfigModal: React.FC<ConfigModalProps> = ({
  closeConfigModal,
  saveConfig,
  defaultValues,
}) => {
  const [tuser, setTuser] = useState(defaultValues.twitchUser);
  const [ylink, setYlink] = useState(defaultValues.youtubeVideoId);
  const [ykey, setYkey] = useState(defaultValues.youtubeApiKey);
  const [kuser, setKuser] = useState(defaultValues.kickUser);
  return (
    <div className="fixed flex justify-center items-center w-screen h-screen bg-gray-600 bg-opacity-30">
      <div className="flex justify-center items-center w-4/5 h-5/6">
        <Button
          variant="outline"
          size="icon"
          className="top-[18%] right-[19.5%] absolute"
          onClick={closeConfigModal}
        >
          <X className="h-4 w-4" />
        </Button>
        <Card className="flex flex-col justify-center items-center w-4/5 h-5/6">
          <CardHeader className="text-center">
            <CardTitle>Chatty Settings</CardTitle>
            <CardDescription>Change your Chatty Settings</CardDescription>
          </CardHeader>
          <CardContent className="w-[60%]">
            <ConfigInput
              label="youtubeLink"
              value={ylink}
              required={false}
              onChange={setYlink}
            />
            <ConfigInput
              label="youtubeKey"
              value={ykey}
              required={ylink !== ""}
              onChange={setYkey}
            />
            <ConfigInput
              label="twitchUser"
              value={tuser}
              onChange={setTuser}
              required={false}
            />
            <ConfigInput
              label="kickUser"
              value={kuser}
              onChange={setKuser}
              required={false}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={() => saveConfig(tuser, ylink, ykey, kuser)}>
              Save
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
