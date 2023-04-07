import { FC } from "react";
import classNames from "classnames";

// Icons
import { RiCloseFill } from "react-icons/ri";

export type AttachmentType = {
  id?: string;
  createdAt?: Date;
  postId: string | null;
  url: string;
};

interface AttachmentsProps {
  onRemoveAttachment?: (attachment: AttachmentType) => void;
  attachments: AttachmentType[];
}

interface AttachmentProps {
  onRemoveAttachment?: (attachment: AttachmentType) => void;
  attachment: AttachmentType;
  fill: boolean;
}

export const Attachments: FC<AttachmentsProps> = ({
  attachments,
  onRemoveAttachment,
}) => {
  const className = classNames("grid gap-2 h-full w-full", {
    "grid-rows-1": attachments.length <= 2,
    "grid-rows-2": attachments.length > 2,
    "grid-cols-1": attachments.length === 1,
    "grid-cols-2": attachments.length > 1,
  });

  return (
    <div className={className}>
      {attachments.map((attachment, i) => (
        <Attachment
          key={i}
          attachment={attachment}
          fill={attachments.length === 3 && i === 0}
          onRemoveAttachment={onRemoveAttachment}
        />
      ))}
    </div>
  );
};

export const Attachment: FC<AttachmentProps> = ({
  attachment,
  fill,
  onRemoveAttachment,
}) => {
  const className = classNames("relative overflow-hidden rounded-lg shadow", {
    "row-span-2": fill,
  });
  return (
    <div className={className}>
      {onRemoveAttachment && (
        <div className="absolute right-2 top-2 z-30">
          <div
            className="cursor-pointer rounded-full bg-gray-800/50 p-0.5 hover:bg-gray-800/30"
            onClick={() => onRemoveAttachment(attachment)}
          >
            <RiCloseFill className="text-xl text-white" />
          </div>
        </div>
      )}
      <img
        className="h-full w-full object-cover"
        alt="Attachment"
        src={attachment.url}
      />
    </div>
  );
};
